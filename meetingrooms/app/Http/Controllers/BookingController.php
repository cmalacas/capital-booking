<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Booking;
use App\MeetingRoom;
use App\User;

use DB;
use Omnipay\Omnipay;
use App\Sagetransaction;

class BookingController extends Controller
{
    public function get(Request $request) {

        $user = User::find(auth()->id());

        if ($request->has('room_id') && $request->get('room_id') > 0) {

            $room_id = $request->get('room_id');

        } else {

            $room_id = MeetingRoom::first()->id;

        }

        $bookings = Booking::select(
                            'bookings.*',
                            DB::raw('TIME_FORMAT(from_time, "%h:%i %p") as _from_time'),
                            DB::raw('TIME_FORMAT(to_time, "%h:%i %p") as _to_time'),
                            DB::raw('CONCAT(firstname, " ", lastname) as client_name'),
                            DB::raw('email'),
                            DB::raw('meeting_rooms.name as meeting_room_name'),
                            DB::raw('IF(sagetransactions.payment_status = 1, "Success", "Pending") as payment_status_text'),
                            DB::raw('IF(date < NOW(), "Expired", "Not Expired") as expired_status_text')
                        )
                        ->join('meeting_rooms', 'meeting_rooms.id', '=', 'meetingroom_id')
                        ->join('users', 'users.id', '=', 'client_id')
                        ->leftJoin('sagetransactions', 'sagetransactions.booking_id', '=', 'bookings.id')
                        ->where(DB::raw('bookings.deleted'), '=', 0)
                        ->where('meetingroom_id', '=', $room_id)
                        ->where('sagetransactions.payment_status', '=', 2)
                        ->orderBy('date', 'desc');

        if ($user->type === 0) {

            $booking = $bookings->where(DB::raw('bookings.client_id'), '=', $user->id);

        }
                        
        $bookings = $bookings->get();

        $meetingroom = MeetingRoom::where('id', '=', $room_id)->first();

        $meetingrooms = MeetingRoom::orderBy('name')->get();

        $data = ['bookings' => $bookings, 'meetingroom' => $meetingroom, 'meetingrooms' => $meetingrooms];

        return response()->json($data, 200, [], JSON_NUMERIC_CHECK);

    }

    public function save(Request $request) {

        $booking = new Booking;

        $booking->client_id = $request->get('client_id');
        $booking->date = $request->get('booking_date');
        $booking->client_id = $request->get('client_id');
        $booking->meetingroom_id = $request->get('meeting_room_id');
        $booking->from_time = $request->get('from_time');        
        $booking->duration = $request->get('duration');
        $booking->to_time = (string)$request->get('to_time');
        $booking->description = $request->get('description');
        $payment_type = $request->get('payment_type');
        $booking->free_of_charge = $payment_type === 2 ? 1 : 0;        
        $booking->payment_status = 0;
        $booking->total_amount = $request->get('total_amount');
        $booking->deleted = $payment_type === 1 ? 1 : 0;

        $booking->your_company_name = $request->get('your_company_name');
        $booking->your_account_email = $request->get('your_account_email');

        $booking->from_date = sprintf("%s %s", $request->get('booking_date'), $request->get('from_time'));

        $booking->to_date = sprintf("%s %s", $request->get('booking_date'), $request->get('to_time'));

        $booking->save();

        if ($payment_type == 1) {

            $gateway = OmniPay::create('SagePay\Form')->initialize([
                'vendor' => env('SAGEPAY_VENDOR'),
                'testMode' => env('SAGEPAY_TESTMODE'),
                'encryptionKey' => env('SAGEPAY_KEY')               
            ]);

                       
            $successUrl = url('/bookings/'.$booking->id.'/success');
            $failedUrl = url('/bookings/'.$booking->id.'/failed');

            $params = [
                
                    'Description' => $request->get('meeting_room_name'),

                    'card' => [
                        'billingFirstName' => $request->get('card_first_name'),
                        'billingLastName' => $request->get('card_last_name'),
                        'billingAddress1' => $request->get('card_address'),
                        'billingCity' => $request->get('card_city'),
                        'billingPostcode' => $request->get('card_postcode'),
                        'billingCountry' => 'GB',
                    ],

                    'transactionId' => $booking->id,
                    
                    'amount' => number_format($booking->total_amount, 2, '.',''),
                    'currency' => 'GBP',
                    
                    'billingForShipping' => true,

                    'shippingFirstName' => $request->get('card_first_name'),
                    'shippingLastName' => $request->get('card_last_name'),
                    'shippingAddress1' => $request->get('card_address'),
                    'shippingCity' => $request->get('card_city'),
                    'shippingPostcode' => $request->get('card_postcode'),
                    'shippingCountry' => 'GB',

                    'returnUrl' => $successUrl,
                    'failureUrl' => $failedUrl,
                ];

            $response = $gateway->purchase($params)->send();

            $method = $response->getRedirectMethod();
            $url = $response->getRedirectUrl();
            $hiddenFormItems = $response->getRedirectData();

            $request->session()->put('sagepay-method', $method);
            $request->session()->put('sagepay-url', $url);
            $request->session()->put('sagepay-items', $hiddenFormItems);

            return response()->json(['url' => '/checkout/online-payment'], 200, [], JSON_NUMERIC_CHECK);

        } else {

            $t = new Sagetransaction;

            $t->type = 1;
            $t->booking_id = $booking->id;
            $t->client_id = $booking->client_id;
            $t->offline_notes = (string)$request->get('offline_notes');
            $t->amount = $booking->total_amount;
            $t->payment_type = $payment_type;

            $t->save();

            $booking->deleted = 0;
            $booking->payment_status = 1;

            $booking->save();

        }

        //$booking->transactions;
        //$booking->user;
        //$booking->room;
        //$booking->client;


        //return response()->json(['success' => true, 'booking' => $booking, 'code' => $booking->id], 200, [], JSON_NUMERIC_CHECK);


        return $this->get();

    }

    public function onlinePayment(Request $request) {

        $data['method'] = $request->session()->get('sagepay-method');
        $data['url'] = $request->session()->get('sagepay-url');
        $data['items'] = $request->session()->get('sagepay-items');

        return view('sagepay.form', $data);

    }

    public function success(Request $request, $booking_id) {

        $gateway = OmniPay::create('SagePay\Form')->initialize([
            'vendor' => env('SAGEPAY_VENDOR'),
            'testMode' => env('SAGEPAY_TESTMODE'),
            'encryptionKey' => env('SAGEPAY_KEY')
        ]);  

        $crypt = $request->get('crypt');

        $booking = Booking::find($booking_id);

        $response = $gateway->completePurchase(['crypt' => $crypt])->send();

        $sage = new SageTransaction;

        $sage->booking_id = $booking_id;
        $sage->client_id = $booking->client_id;

        $response->payment_type = 1;

        $transactions = $sage->update_transactions($booking_id, $response, 'online');

    }
}

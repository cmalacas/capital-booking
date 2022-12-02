<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Booking;
use App\MeetingRoom;

use DB;
use Omnipay\Omnipay;

class BookingController extends Controller
{
    public function get() {

        $bookings = Booking::select(
                            'bookings.*',
                            DB::raw('CONCAT(firstname, " ", lastname) as client_name'),
                            DB::raw('meetingrooms.name as meeting_room_name')
                        )
                        ->join('meetingrooms', 'meetingrooms.id', '=', 'meetingroom_id')
                        ->join('users', 'users.id', '=', 'client_id')
                        ->get();
        $meetingrooms = MeetingRoom::orderBy('name')
                            ->where('status', '=', 1)
                            ->where('deleted', '=', 0)
                            ->get();

        $data = ['bookings' => $bookings, 'meetingrooms' => $meetingrooms];

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
        
        $booking->payment_status = in_array($payment_type, [0,2]) ? 1 : 0;

        $booking->total_amount = $request->get('total_amount');

        $booking->save();

        if ($payment_type == 1) {

            $gateway = OmniPay::create('SagePay\Form')->initialize([
                'vendor' => env('SAGEPAY_VENDOR'),
                'testMode' => env('SAGEPAY_TESTMODE'),
                'encryptionKey' => env('SAGEPAY_KEY')               
            ]);
            
            $successUrl = url('/booking/'.$booking->id.'/success');
            $failedUrl = url('/booking/'.$booking->id.'/failed');

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

        }

        //$booking->transactions;
        //$booking->user;
        //$booking->room;
        //$booking->client;


        //return response()->json(['success' => true, 'booking' => $booking, 'code' => $booking->id], 200, [], JSON_NUMERIC_CHECK);


        return $this->get();

    }
}

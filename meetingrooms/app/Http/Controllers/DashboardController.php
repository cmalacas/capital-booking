<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\User;
use App\Booking;

use Carbon\Carbon;

use DB;
use Omnipay\Omnipay;
use App\Sagetransaction;


class DashboardController extends Controller
{
    public function save(Request $request) {

        $booking = new Booking;

        $user = User::find(auth()->id());

        $booking->client_id = $user->id;
        $booking->date = $request->get('booking_date');
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

        $booking->attendee = $request->get('attendee');

        $booking->company = $request->get('company');

        $booking->from_date = sprintf("%s %s", $request->get('booking_date'), $request->get('from_time'));

        $booking->to_date = sprintf("%s %s", $request->get('booking_date'), $request->get('to_time'));


        $booking->save();

        $meeting_room_name = $booking->room->name;
        $date = Carbon::parse($booking->date)->format("d/M/Y");
        $start_time = $booking->start_time;
        $end_time = $booking->end_time;
        $duration = $booking->duration;

        $meeting_description = sprintf("%s %s %s", $meeting_room_name, $date, $start_time, $end_time, $duration);

        
        $gateway = OmniPay::create('SagePay\Form')->initialize([
            'vendor' => env('SAGEPAY_VENDOR'),
            'testMode' => env('SAGEPAY_TESTMODE'),
            'encryptionKey' => env('SAGEPAY_KEY')               
        ]);

                       
        $successUrl = url('/dashboard/'.$booking->id.'/success');
        $failedUrl = url('/dashboard/'.$booking->id.'/failed');

        $params = [
            
                'Description' => $meeting_description,

                'card' => [
                    'billingFirstName' => $request->get('card_first_name'),
                    'billingLastName' => $request->get('card_last_name'),
                    'billingAddress1' => $request->get('card_address'),
                    'billingCity' => $request->get('card_city'),
                    'billingPostcode' => $request->get('card_postcode'),
                    'billingCountry' => 'GB',
                ],

                'transactionId' => sprintf("CAPITAL-OFFICE-BOOKING-%s-%s",  env('APP_ENV'), $booking->id),
                
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


    }

    public function success(Request $request, $booking_id) {

        $gateway = OmniPay::create('SagePay\Form')->initialize([
            'vendor' => env('SAGEPAY_VENDOR'),
            'testMode' => env('SAGEPAY_TESTMODE'),
            'encryptionKey' => env('SAGEPAY_KEY')
        ]);  

        $crypt = $_REQUEST['crypt'];

        $booking = Booking::find($booking_id);

        $response = $gateway->completePurchase(['crypt' => $crypt, 'transactionId' => sprintf("CAPITAL-OFFICE-BOOKING-%s-%s", env('APP_ENV'), $booking_id)])->send();

        $sage = new SageTransaction;

        $sage->booking_id = $booking_id;
        $sage->client_id = $booking->client_id;

        $response->payment_type = 1;

        $transactions = $sage->update_transactions($booking_id, $response, 'online');

        return redirect('/dashboard');

    }

    public function checkBooking(Request $request) {

        $bookingDate = $request->get('booking_date');

        $fromTime = $request->get('from_time');
        $toTime = $request->get('to_time');

        $duration = $request->get('duration');

        list($hours, $mins) = explode(':', $toTime);

        if ((int)$hours > 16) {

            return response()->json(['error' => 1], 200, [], JSON_NUMERIC_CHECK);

        } else {

            $fromDate = sprintf("%s %s", $bookingDate, $fromTime);
            $toDate = sprintf("%s %s", $bookingDate, $toTime);

            
            $meeting_room_id = $request->get('meeting_room_id');

            //DB::enableQueryLog();

            /* $bookings = Booking::whereRaw("date = '$bookingDate' AND
                                            meetingroom_id = $meeting_room_id AND
                                            deleted = 0 AND
                                            expired_status = 0 AND (
                                                ('$fromDate' >= from_date AND '$toDate' <= date_add(to_date, INTERVAL 15 MINUTE)) OR
                                                ('$fromDate' < from_date AND '$toDate' < date_add(to_date, INTERVAL 15 MINUTE)) OR
                                                ('$fromDate' > from_date  AND '$fromDate' <= DATE_ADD(to_date, INTERVAL 15 MINUTE) AND DATE_ADD(to_date, INTERVAL 15 MINUTE) <= '$toDate')
                                            )"
                                        )
                                ->get(); */

            $bookings = Booking::whereRaw("date = '$bookingDate' AND
                                        meetingroom_id = $meeting_room_id AND
                                        deleted = 0 AND
                                        sagetransactions.payment_status = 2 AND
                                        expired_status = 0 AND (
                                            '$fromDate' BETWEEN from_date AND to_date
                                        )"
                                    )
                            ->join('sagetransactions', 'sagetransactions.booking_id', '=', 'bookings.id')
                            ->get();

            //var_dump(DB::getQueryLog());


            return response()->json(['bookings' => $bookings], 200, [], JSON_NUMERIC_CHECK);


        }
    }
}

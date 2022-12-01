<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Booking;
use App\MeetingRoom;

use DB;

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

        $booking->total_amount = 0;

        $booking->save();


        return $this->get();

    }
}

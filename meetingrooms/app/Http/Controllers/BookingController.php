<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Booking;

class BookingController extends Controller
{
    public function get() {

        $bookings = Booking::get();

        return response()->json(['bookings' => $bookings], 200, [], JSON_NUMERIC_CHECK);

    }
}

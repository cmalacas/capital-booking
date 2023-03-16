<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

# use App\MeetingRoom;

class MeetingRoomController extends Controller
{
    public function get() {

        $meetingrooms = \App\MeetingRoom::where('deleted', '=', 0)->get();

        return response()->json(['meetingrooms' => $meetingrooms], 200, [], JSON_NUMERIC_CHECK);

    }

    public function save(Request $request) {

        $room = new \App\MeetingRoom;

        $room->name = $request->get('name');
        $room->amount_1 = $request->get('amount_1');
        $room->amount_2 = $request->get('amount_2');
        $room->amount_4 = $request->get('amount_4');
        $room->amount_8 = $request->get('amount_8');
        $room->amount_6 = $request->get('amount_6');

        $room->status = $request->get('status');

        $room->save();

        return $this->get();


    }

    public function update(Request $request) {

        $room = \App\MeetingRoom::find($request->get('id'));

        $room->name = $request->get('name');
        $room->amount_1 = $request->get('amount_1');
        $room->amount_2 = $request->get('amount_2');
        $room->amount_4 = $request->get('amount_4');
        $room->amount_8 = $request->get('amount_8');
        $room->amount_6 = $request->get('amount_6');

        $room->status = $request->get('status');

        $room->save();

        return $this->get();


    }

    public function updateStatus(Request $request) {

        $room = \App\MeetingRoom::find($request->get('id'));

        $room->status = $room->status == 1 ? 0 : 1;

        $room->save();

        return $this->get();


    }

    public function delete(Request $request) {

        $room = \App\MeetingRoom::find($request->get('id'));

        $room->status = $room->deleted = 1;

        $room->save();

        return $this->get();


    }
}

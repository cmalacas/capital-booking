<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    public function room() {

        return $this->belongsTo('App\MeetingRoom', 'meetingroom_id' );

    }
}

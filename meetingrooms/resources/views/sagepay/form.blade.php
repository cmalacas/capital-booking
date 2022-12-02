@extends('layouts.app')

@section('content')
    <form method={{ $method }} id="SagePayForm" action="{{ $url }}">
        @foreach($items as $name => $value)
            <input type="hidden" name="{{ $name }}" value="{{ $value }}" />
        @endforeach
        <input type="submit" value="Pay">
    </form>

    <script>
       document.getElementById("SagePayForm").submit();
    </script>
@endsection

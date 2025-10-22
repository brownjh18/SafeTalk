@extends('layouts.app')

@section('content')
    <div class="row">
        <div class="col-lg-12 margin-tb">
            <div class="pull-left">
                <h2>Programs</h2>
            </div>
            <div class="pull-right mb-2">
                <a class="btn btn-success" href="{{ route('programs.create') }}"> Create New Program</a>
            </div>
        </div>
    </div>

    @if ($message = Session::get('success'))
        <div class="alert alert-success">
            <p>{{ $message }}</p>
        </div>
    @endif

    <table class="table table-bordered">
        <tr>
            <th>No</th>
            <th>Name</th>
            <th>Description</th>
            <th width="280px">Action</th>
        </tr>
        @foreach ($programs as $program)
        <tr>
            {{-- Use the built-in $loop variable --}}
            <td>{{ $loop->iteration }}</td>
            <td>{{ $program->name }}</td>
            <td>{{ $program->description }}</td>
            <td>
                <form action="{{ route('programs.destroy', $program->program_id) }}" method="POST">

                    <a class="btn btn-info" href="{{ route('programs.show', $program->program_id) }}">Show</a>

                    <a class="btn btn-primary" href="{{ route('programs.edit', $program->program_id) }}">Edit</a>

                    <a class="btn btn-secondary" href="{{ route('programs.projects', $program->program_id) }}">Projects</a>

                    @csrf
                    @method('DELETE')

                    <button type="submit" class="btn btn-danger">Delete</button>
                </form>
            </td>
        </tr>
        @endforeach
    </table>
@endsection
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
                <a class="btn btn-info btn-sm" href="{{ route('programs.show', $program->program_id) }}">
                    <svg class="h-4 w-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    View Details
                </a>

                <a class="btn btn-primary btn-sm" href="{{ route('programs.edit', $program->program_id) }}">Edit</a>

                <a class="btn btn-secondary btn-sm" href="{{ route('programs.projects', $program->program_id) }}">Projects</a>

                <form action="{{ route('programs.destroy', $program->program_id) }}" method="POST" style="display:inline-block">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Delete this program?')">Delete</button>
                </form>
            </td>
        </tr>
        @endforeach
    </table>
@endsection
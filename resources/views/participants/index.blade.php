@extends('layouts.app')

@section('content')
<div class="container">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Participants</h2>
        <a class="btn btn-success" href="{{ route('participants.create') }}">Create New Participant</a>
    </div>

    @if (session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Affiliation</th>
                <th>Specialization</th>
                <th>Institution</th>
                <th>Cross-Skilled</th>
                <th width="220px">Action</th>
            </tr>
        </thead>
        <tbody>
        @forelse ($participants as $p)
            <tr>
                <td>{{ $p->full_name }}</td>
                <td>{{ $p->email }}</td>
                <td>{{ $p->affiliation }}</td>
                <td>{{ $p->specialization }}</td>
                <td>{{ $p->institution }}</td>
                <td>{{ $p->cross_skill_trained ? 'Yes' : 'No' }}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <a class="btn btn-info btn-sm mr-2 px-3 py-1" href="{{ route('participants.show', $p->participant_id) }}">
                            <svg class="h-4 w-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            View Details
                        </a>
                        <a class="btn btn-primary btn-sm mr-2 px-3 py-1" href="{{ route('participants.edit', $p->participant_id) }}">Edit</a>
                        <form action="{{ route('participants.destroy', $p->participant_id) }}" method="POST" class="m-0">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger btn-sm px-3 py-1" onclick="return confirm('Delete this participant?')">Delete</button>
                        </form>
                    </div>
                </td>
            </tr>
        @empty
            <tr><td colspan="7" class="text-center">No participants found.</td></tr>
        @endforelse
        </tbody>
    </table>
</div>
@endsection

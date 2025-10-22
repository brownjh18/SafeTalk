@extends('layouts.app')

@section('content')
<div class="container">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Participant Profile</h2>
        <div>
            <a class="btn btn-primary" href="{{ route('participants.edit', $participant->participant_id) }}">Edit</a>
            <a class="btn btn-secondary" href="{{ route('participants.index') }}">Back to List</a>
        </div>
    </div>

    <div class="card mb-3">
        <div class="card-body">
            <h4 class="card-title">{{ $participant->full_name }}</h4>
            <p><strong>Email:</strong> {{ $participant->email }}</p>
            <p><strong>Affiliation:</strong> {{ $participant->affiliation }}</p>
            <p><strong>Specialization:</strong> {{ $participant->specialization }}</p>
            <p><strong>Participant Type:</strong> {{ $participant->participant_type }}</p>
            <p><strong>Institution:</strong> {{ $participant->institution }}</p>
            <p><strong>Cross-skill Trained:</strong> {{ $participant->cross_skill_trained ? 'Yes' : 'No' }}</p>
        </div>
    </div>

    <div class="card">
        <div class="card-body">
            <h5 class="card-title">Assigned Projects</h5>

            @if (session('success'))
                <div class="alert alert-success">{{ session('success') }}</div>
            @endif
            @if (session('error'))
                <div class="alert alert-danger">{{ session('error') }}</div>
            @endif

            <ul class="list-group mb-3">
                @forelse ($participant->projects as $proj)
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <span>{{ $proj->title }}</span>
                        <form action="{{ route('participants.projects.remove', [$participant->participant_id, $proj->project_id]) }}" method="POST" class="m-0">
                            @csrf
                            @method('DELETE')
                            <button class="btn btn-sm btn-outline-danger" onclick="return confirm('Remove from project?')">Remove</button>
                        </form>
                    </li>
                @empty
                    <li class="list-group-item">No projects assigned.</li>
                @endforelse
            </ul>

            <form action="{{ route('participants.assign', $participant->participant_id) }}" method="POST">
                @csrf
                <div class="form-row align-items-end">
                    <div class="col-md-6 mb-2">
                        <label for="project_id">Assign to Project</label>
                        <select name="project_id" id="project_id" class="form-control">
                            @foreach (\App\Models\Project::orderBy('title')->get() as $project)
                                <option value="{{ $project->project_id }}">{{ $project->title }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-3 mb-2">
                        <button class="btn btn-success" type="submit">Assign</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection

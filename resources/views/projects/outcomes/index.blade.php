@extends('layouts.app')

@section('content')
<div class="container">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Outcomes for: {{ $project->title }}</h2>
        <a class="btn btn-success" href="{{ route('projects.outcomes.create', ['project' => $project->project_id]) }}">
    Upload New Outcome
</a>
    </div>

    @if (session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif
    @if (session('error'))
        <div class="alert alert-danger">{{ session('error') }}</div>
    @endif

    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Certification</th>
                <th>Commercialization</th>
                <th>Artifact</th>
                <th width="240">Action</th>
            </tr>
        </thead>
        <tbody>
        @forelse ($project->outcomes as $outcome)
            <tr>
                <td>{{ $outcome->title }}</td>
                <td>{{ $outcome->outcome_type }}</td>
                <td>{{ $outcome->quality_certification }}</td>
                <td>{{ $outcome->commercialization_status }}</td>
                <td>
                    @if($outcome->artifact_link)
                        <a href="{{ route('projects.outcomes.download', [$project->project_id, $outcome->outcome_id]) }}" class="btn btn-outline-secondary btn-sm">Download</a>
                    @else
                        <span class="text-muted">No file</span>
                    @endif
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <a class="btn btn-primary btn-sm mr-2" href="{{ route('projects.outcomes.edit', [$project->project_id, $outcome->outcome_id]) }}">Edit</a>
                        <form action="{{ route('projects.outcomes.destroy', [$project->project_id, $outcome->outcome_id]) }}" method="POST" class="m-0">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Delete this outcome?')">Delete</button>
                        </form>
                    </div>
                </td>
            </tr>
        @empty
            <tr><td colspan="6" class="text-center">No outcomes found.</td></tr>
        @endforelse
        </tbody>
    </table>
</div>
@endsection

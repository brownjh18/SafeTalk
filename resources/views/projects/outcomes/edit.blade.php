@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Edit Outcome for: {{ $project->title }}</h2>

    @if ($errors->any())
        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('projects.outcomes.update', [$project->project_id, $outcome->outcome_id]) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        <div class="form-group mb-2">
            <label>Title</label>
            <input type="text" name="title" class="form-control" value="{{ old('title', $outcome->title) }}" required>
        </div>
        <div class="form-group mb-2">
            <label>Description</label>
            <textarea name="description" class="form-control">{{ old('description', $outcome->description) }}</textarea>
        </div>
        <div class="form-group mb-2">
            <label>Outcome Type</label>
            <select name="outcome_type" class="form-control" required>
                <option value="">Select type</option>
                @foreach ($types as $t)
                    <option value="{{ $t }}" {{ old('outcome_type', $outcome->outcome_type) === $t ? 'selected' : '' }}>{{ $t }}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group mb-2">
            <label>Quality Certification</label>
            <input type="text" name="quality_certification" class="form-control" value="{{ old('quality_certification', $outcome->quality_certification) }}" placeholder="e.g., UIRI certification">
        </div>
        <div class="form-group mb-2">
            <label>Commercialization Status</label>
            <select name="commercialization_status" class="form-control">
                <option value="">Select status</option>
                @foreach ($statuses as $s)
                    <option value="{{ $s }}" {{ old('commercialization_status', $outcome->commercialization_status) === $s ? 'selected' : '' }}>{{ $s }}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group mb-3">
            <label>Replace Artifact (optional)</label>
            <input type="file" name="artifact" class="form-control-file">
            @if ($outcome->artifact_link)
                <small class="form-text text-muted">Current: <a href="{{ route('projects.outcomes.download', [$project->project_id, $outcome->outcome_id]) }}">Download existing</a></small>
            @endif
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
        <a href="{{ route('projects.outcomes.index', $project->project_id) }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection

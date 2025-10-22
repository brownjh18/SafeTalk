@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Create Participant</h2>

    @if ($errors->any())
        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('participants.store') }}" method="POST">
        @csrf
        <div class="form-group mb-2">
            <label>Full Name</label>
            <input type="text" name="full_name" class="form-control" value="{{ old('full_name') }}" required>
        </div>
        <div class="form-group mb-2">
            <label>Email</label>
            <input type="email" name="email" class="form-control" value="{{ old('email') }}" required>
        </div>
        <div class="form-group mb-2">
            <label>Affiliation</label>
            <select name="affiliation" class="form-control" required>
                <option value="">Select</option>
                @foreach ($affiliations as $a)
                    <option value="{{ $a }}" {{ old('affiliation') === $a ? 'selected' : '' }}>{{ $a }}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group mb-2">
            <label>Specialization</label>
            <select name="specialization" class="form-control" required>
                <option value="">Select</option>
                @foreach ($specializations as $s)
                    <option value="{{ $s }}" {{ old('specialization') === $s ? 'selected' : '' }}>{{ $s }}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group mb-2">
            <label>Participant Type</label>
            <select name="participant_type" class="form-control" required>
                <option value="">Select</option>
                @foreach ($participantTypes as $pt)
                    <option value="{{ $pt }}" {{ old('participant_type') === $pt ? 'selected' : '' }}>{{ $pt }}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group mb-2">
            <label>Institution</label>
            <select name="institution" class="form-control" required>
                <option value="">Select</option>
                @foreach ($institutions as $i)
                    <option value="{{ $i }}" {{ old('institution') === $i ? 'selected' : '' }}>{{ $i }}</option>
                @endforeach
            </select>
        </div>
        
        <div class="form-group mb-2">
            <label>Assign to Project</label>
            <select name="project_id" class="form-control">
                <option value="">-- Select a Project --</option>
                @foreach ($projects as $proj)
                    <option value="{{ $proj->project_id }}">
                        {{ $proj->title }}
                        @if ($proj->program)
                            ({{ $proj->program->name }})
                        @endif
                    </option>
                @endforeach
            </select>
        </div>

        <div class="form-group form-check mb-3">
            <input type="checkbox" name="cross_skill_trained" id="cross_skill_trained" value="1" class="form-check-input" {{ old('cross_skill_trained') ? 'checked' : '' }}>
            <label class="form-check-label" for="cross_skill_trained">Cross-skill Trained</label>
        </div>

        <button type="submit" class="btn btn-success">Save</button>
        <a href="{{ route('participants.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection

@extends('layouts.app')

@section('content')
<div class="container">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Create Service</h2>
        <a class="btn btn-secondary" href="{{ route('services.index') }}">Back</a>
    </div>

    @if ($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('services.store') }}" method="POST">
        @csrf
        <div class="mb-3">
            <label class="form-label"><strong>Facility ID</strong></label>
            <input type="text" name="facility_id" value="{{ old('facility_id', $prefillFacilityId) }}" class="form-control" required>
        </div>
        <div class="mb-3">
            <label class="form-label"><strong>Name</strong></label>
            <input type="text" name="name" value="{{ old('name') }}" class="form-control" required>
        </div>
        <div class="mb-3">
            <label class="form-label"><strong>Description</strong></label>
            <textarea name="description" class="form-control" rows="3">{{ old('description') }}</textarea>
        </div>
        <div class="mb-3">
            <label class="form-label"><strong>Category</strong></label>
            <select name="category" class="form-control" required>
                <option value="">-- Select Category --</option>
                @foreach ($categories as $cat)
                    <option value="{{ $cat }}" {{ old('category') === $cat ? 'selected' : '' }}>{{ $cat }}</option>
                @endforeach
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label"><strong>Skill Type</strong></label>
            <select name="skill_type" class="form-control" required>
                <option value="">-- Select Skill Type --</option>
                @foreach ($skillTypes as $st)
                    <option value="{{ $st }}" {{ old('skill_type') === $st ? 'selected' : '' }}>{{ $st }}</option>
                @endforeach
            </select>
        </div>
        <button type="submit" class="btn btn-success">Save</button>
    </form>
</div>
@endsection

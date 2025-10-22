@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Edit Facility</h2>

    @if ($errors->any())
        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('facilities.update', $facility->facility_id) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="form-group mb-2">
            <label>Name</label>
            <input type="text" name="name" class="form-control" value="{{ old('name', $facility->name) }}" required>
        </div>
        <div class="form-group mb-2">
            <label>Location</label>
            <input type="text" name="location" class="form-control" value="{{ old('location', $facility->location) }}" required>
        </div>
        <div class="form-group mb-2">
            <label>Description</label>
            <textarea name="description" class="form-control">{{ old('description', $facility->description) }}</textarea>
        </div>
        <div class="form-group mb-2">
            <label>Partner Organization</label>
            <input type="text" name="partner_organization" class="form-control" value="{{ old('partner_organization', $facility->partner_organization) }}">
        </div>
        <div class="form-group mb-2">
            <label>Facility Type</label>
            <select name="facility_type" class="form-control" required>
                <option value="">Select type</option>
                @foreach ($types as $t)
                    <option value="{{ $t }}" {{ old('facility_type', $facility->facility_type) === $t ? 'selected' : '' }}>{{ $t }}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group mb-3">
            <label>Capabilities (comma-separated)</label>
            <textarea name="capabilities" class="form-control">{{ old('capabilities', $facility->capabilities) }}</textarea>
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
        <a href="{{ route('facilities.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection

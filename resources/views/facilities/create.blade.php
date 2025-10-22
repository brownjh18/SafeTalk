@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Create Facility</h2>

    @if ($errors->any())
        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('facilities.store') }}" method="POST">
        @csrf
        <div class="form-group mb-2">
            <label>Name</label>
            <input type="text" name="name" class="form-control" value="{{ old('name') }}" required>
        </div>
        <div class="form-group mb-2">
            <label>Location</label>
            <input type="text" name="location" class="form-control" value="{{ old('location') }}" required>
        </div>
        <div class="form-group mb-2">
            <label>Description</label>
            <textarea name="description" class="form-control">{{ old('description') }}</textarea>
        </div>
        <div class="form-group mb-2">
            <label>Partner Organization</label>
            <input type="text" name="partner_organization" class="form-control" value="{{ old('partner_organization') }}">
        </div>
        <div class="form-group mb-2">
            <label>Facility Type</label>
            <select name="facility_type" class="form-control" required>
                <option value="">Select type</option>
                @foreach ($types as $t)
                    <option value="{{ $t }}" {{ old('facility_type') === $t ? 'selected' : '' }}>{{ $t }}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group mb-3">
            <label>Capabilities (comma-separated)</label>
            <textarea name="capabilities" class="form-control" placeholder="e.g., CNC, PCB fabrication, materials testing">{{ old('capabilities') }}</textarea>
        </div>
        <button type="submit" class="btn btn-success">Save</button>
        <a href="{{ route('facilities.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection

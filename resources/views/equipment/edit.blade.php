@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Edit Equipment</h2>

    @if ($errors->any())
        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('equipment.update', $equipment->equipment_id) }}" method="POST">
        @csrf
        @method('PUT')
       <div class="form-group mb-2">
            <label>Facility</label>
                <select name="facility_id" class="form-control" required>
                    <option value="">Select a facility</option>
                    @foreach ($facilities as $facility)
                        <option value="{{ $facility->facility_id }}" 
                            {{ old('facility_id', $equipment->facility_id) == $facility->facility_id ? 'selected' : '' }}>
                            {{ $facility->name }}
                        </option>
                    @endforeach
                </select>
        </div>
        <div class="form-group mb-2">
            <label>Name</label>
            <input type="text" name="name" class="form-control" value="{{ old('name', $equipment->name) }}" required>
        </div>
        <div class="form-group mb-2">
            <label>Description</label>
            <textarea name="description" class="form-control">{{ old('description', $equipment->description) }}</textarea>
        </div>
        <div class="form-group mb-2">
            <label>Capabilities (comma-separated)</label>
            <textarea name="capabilities" class="form-control">{{ old('capabilities', $equipment->capabilities) }}</textarea>
        </div>
        <div class="form-group mb-2">
            <label>Inventory Code</label>
            <input type="text" name="inventory_code" class="form-control" value="{{ old('inventory_code', $equipment->inventory_code) }}">
        </div>
        <div class="form-group mb-2">
            <label>Usage Domain</label>
            <select name="usage_domain" class="form-control">
                <option value="">Select domain</option>
                @foreach ($usageDomains as $ud)
                    <option value="{{ $ud }}" {{ old('usage_domain', $equipment->usage_domain) === $ud ? 'selected' : '' }}>{{ $ud }}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group mb-3">
            <label>Support Phase</label>
            <select name="support_phase" class="form-control">
                <option value="">Select phase</option>
                @foreach ($supportPhases as $sp)
                    <option value="{{ $sp }}" {{ old('support_phase', $equipment->support_phase) === $sp ? 'selected' : '' }}>{{ $sp }}</option>
                @endforeach
            </select>
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
        <a href="{{ route('equipment.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection

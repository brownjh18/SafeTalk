@extends('layouts.app')

@section('content')
<div class="container">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Equipment Details</h2>
        <div>
            <a class="btn btn-primary" href="{{ route('equipment.edit', $equipment->equipment_id) }}">Edit</a>
            <a class="btn btn-secondary" href="{{ route('equipment.index') }}">Back to List</a>
        </div>
    </div>

    <div class="card mb-3">
        <div class="card-body">
            <h4 class="card-title">{{ $equipment->name }}</h4>
            <p><strong>Facility ID:</strong> {{ $equipment->facility_id }}</p>
            @if(isset($facility))
                <p><strong>Facility:</strong> {{ $facility->name }} ({{ $facility->facility_type }})</p>
            @endif
            <p><strong>Usage Domain:</strong> {{ $equipment->usage_domain }}</p>
            <p><strong>Support Phase:</strong> {{ $equipment->support_phase }}</p>
            <p><strong>Inventory Code:</strong> {{ $equipment->inventory_code }}</p>
            <p><strong>Description:</strong> {{ $equipment->description }}</p>
            <p><strong>Capabilities:</strong> {{ $equipment->capabilities }}</p>
        </div>
    </div>
</div>
@endsection

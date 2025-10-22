@extends('layouts.app')

@section('content')
<div class="container">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Facility Details</h2>
        <div>
            <a class="btn btn-primary" href="{{ route('facilities.edit', $facility->facility_id) }}">Edit</a>
            <a class="btn btn-secondary" href="{{ route('facilities.index') }}">Back to List</a>
        </div>
    </div>

    <div class="card mb-3">
        <div class="card-body">
            <h4 class="card-title">{{ $facility->name }}</h4>
            <p><strong>Type:</strong> {{ $facility->facility_type }}</p>
            <p><strong>Partner Organization:</strong> {{ $facility->partner_organization }}</p>
            <p><strong>Location:</strong> {{ $facility->location }}</p>
            <p><strong>Description:</strong> {{ $facility->description }}</p>
            <p><strong>Capabilities:</strong> {{ $facility->capabilities }}</p>
        </div>
    </div>

    <div class="row">
        <div class="col-md-6">
            <div class="card">
                <div class="card-body">
                    <h5>Linked Records</h5>
                    <p>Projects: <strong>{{ $projectsCount }}</strong></p>
                    <p>Services: <strong>{{ $servicesCount }}</strong></p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

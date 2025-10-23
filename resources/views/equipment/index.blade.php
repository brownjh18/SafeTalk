@extends('layouts.app')

@section('content')
<div class="container">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Equipment</h2>
        <a class="btn btn-success" href="{{ route('equipment.create') }}">Create New Equipment</a>
    </div>

    <form method="GET" action="{{ route('equipment.index') }}" class="mb-3">
        <div class="row g-2">
            <div class="col-md-3">
                <input type="text" name="facility_id" value="{{ request('facility_id', $selectedFacilityId ?? '') }}" class="form-control" placeholder="Filter by Facility ID">
            </div>
            <div class="col-md-3">
                <select name="usage_domain" class="form-control">
                    <option value="">All Usage Domains</option>
                    @foreach ($usageDomains as $ud)
                        <option value="{{ $ud }}" {{ request('usage_domain') === $ud ? 'selected' : '' }}>{{ $ud }}</option>
                    @endforeach
                </select>
            </div>
            <div class="col-md-3">
                <input type="text" name="capability" value="{{ request('capability') }}" class="form-control" placeholder="Filter by Capability">
            </div>
            <div class="col-md-3">
                <input type="text" name="q" value="{{ request('q') }}" class="form-control" placeholder="Search name/description/code">
            </div>
            <div class="col-md-2 mt-2">
                <button type="submit" class="btn btn-primary w-100">Filter</button>
            </div>
        </div>
    </form>

    @if (session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif
    @if (session('error'))
        <div class="alert alert-danger">{{ session('error') }}</div>
    @endif

    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Equipment ID</th>
                <th>Name</th>
                <th>Facility ID</th>
                <th>Usage Domain</th>
                <th>Support Phase</th>
                <th>Inventory Code</th>
                <th>Capabilities</th>
                <th width="200px">Action</th>
            </tr>
        </thead>
        <tbody>
        @forelse ($equipment as $item)
            <tr>
                <td>{{ $item->equipment_id }}</td>
                <td>{{ $item->name }}</td>
                <td>{{ $item->facility_id }}</td>
                <td>{{ $item->usage_domain }}</td>
                <td>{{ $item->support_phase }}</td>
                <td>{{ $item->inventory_code }}</td>
                <td>{{ Str::limit($item->capabilities, 60) }}</td>
                <td>
                    <a class="btn btn-info btn-sm" href="{{ route('equipment.show', $item->equipment_id) }}">
                        <svg class="h-4 w-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        View Details
                    </a>
                    <a class="btn btn-primary btn-sm" href="{{ route('equipment.edit', $item->equipment_id) }}">Edit</a>
                    <form action="{{ route('equipment.destroy', $item->equipment_id) }}" method="POST" style="display:inline-block">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Delete this equipment?')">Delete</button>
                    </form>
                </td>
            </tr>
        @empty
            <tr><td colspan="8" class="text-center">No equipment found.</td></tr>
        @endforelse
        </tbody>
    </table>
</div>
@endsection

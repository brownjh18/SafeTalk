@extends('layouts.app')

@section('content')
<div class="row">
    <div class="col-lg-12 margin-tb">
        <div class="pull-left">
            <h2>Edit Project</h2>
        </div>
        <div class="pull-right">
            <a class="btn btn-primary" href="{{ route('projects.index') }}"> Back</a>
        </div>
    </div>
</div>

@if ($errors->any())
    <div class="alert alert-danger">
        <strong>Whoops!</strong> There were some problems with your input.<br><br>
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form action="{{ route('projects.update',$project->project_id) }}" method="POST">
    @csrf
    @method('PUT')

    <div class="row">
        <div class="col-md-6">
            <div class="form-group">
                <label for="program_id"><strong>Program:</strong></label>
                <select name="program_id" id="program_id" class="form-control" required>
                    @foreach ($programs as $program)
                        <option value="{{ $program->program_id }}" {{ $project->program_id === $program->program_id ? 'selected' : '' }}>
                            {{ $program->name }}
                        </option>
                    @endforeach
                </select>
            </div>
        </div>
        <div class="col-md-6">
            <div class="form-group">
                <label for="facility"><strong>Facility:</strong></label>
                <select name="facility" id="facility" class="form-control">
                    <option value="">-- Select Facility (optional) --</option>
                    @foreach ($facilities as $facility)
                        <option value="{{ $facility->facility_id }}" {{ $project->facility_id === $facility->facility_id ? 'selected' : '' }}>
                            {{ $facility->name }}
                        </option>
                    @endforeach
                </select>
            </div>
        </div>

        <div class="col-md-6">
            <div class="form-group">
                <label for="title"><strong>Title:</strong></label>
                <input type="text" name="title" id="title" class="form-control" value="{{ $project->title }}" placeholder="Project Title" required>
            </div>
        </div>
        <div class="col-md-6">
            <div class="form-group">
                <label for="nature_of_project"><strong>Nature of Project:</strong></label>
                <input type="text" name="nature_of_project" id="nature_of_project" class="form-control" value="{{ $project->nature_of_project }}" placeholder="Research, prototype, applied work" required>
            </div>
        </div>

        <div class="col-md-6">
            <div class="form-group">
                <label for="innovation_focus"><strong>Innovation Focus:</strong></label>
                <input type="text" name="innovation_focus" id="innovation_focus" class="form-control" value="{{ $project->innovation_focus }}" placeholder="IoT devices, smart home, renewable energy">
            </div>
        </div>
        <div class="col-md-6">
            <div class="form-group">
                <label for="prototype_stage"><strong>Prototype Stage:</strong></label>
                <input type="text" name="prototype_stage" id="prototype_stage" class="form-control" value="{{ $project->prototype_stage }}" placeholder="Concept, Prototype, MVP, Market Launch">
            </div>
        </div>

        <div class="col-md-12">
            <div class="form-group">
                <label for="description"><strong>Description:</strong></label>
                <textarea name="description" id="description" class="form-control" style="height: 120px" placeholder="Project overview">{{ $project->description }}</textarea>
            </div>
        </div>
        <div class="col-md-12">
            <div class="form-group">
                <label for="testing_requirements"><strong>Testing Requirements:</strong></label>
                <textarea name="testing_requirements" id="testing_requirements" class="form-control" style="height: 120px" placeholder="Compliance and performance checks">{{ $project->testing_requirements }}</textarea>
            </div>
        </div>
        <div class="col-md-12">
            <div class="form-group">
                <label for="commercialization_plan"><strong>Commercialization Plan:</strong></label>
                <textarea name="commercialization_plan" id="commercialization_plan" class="form-control" style="height: 120px" placeholder="Path to market adoption">{{ $project->commercialization_plan }}</textarea>
            </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12 text-center">
            <button type="submit" class="btn btn-primary">Submit</button>
        </div>
    </div>
</form>
@endsection

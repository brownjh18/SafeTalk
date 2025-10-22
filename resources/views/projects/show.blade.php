@extends('layouts.app')

@section('content')
<div class="row">
    <div class="col-lg-12 margin-tb">
        <div class="pull-left">
            <h2> Show Project</h2>
        </div>
        <div class="pull-right">
            <a class="btn btn-primary" href="{{ route('projects.index') }}"> Back</a>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-6">
        <div class="form-group">
            <strong>Title:</strong>
            {{ $project->title }}
        </div>
    </div>
    <div class="col-md-6">
        <div class="form-group">
            <strong>Program:</strong>
            {{ optional($project->program)->name }}
        </div>
    </div>

    <div class="col-md-6">
        <div class="form-group">
            <strong>Nature of Project:</strong>
            {{ $project->nature_of_project }}
        </div>
    </div>
    <div class="col-md-6">
        <div class="form-group">
            <strong>Prototype Stage:</strong>
            {{ $project->prototype_stage }}
        </div>
    </div>

    <div class="col-md-12">
        <div class="form-group">
            <strong>Description:</strong>
            {{ $project->description }}
        </div>
    </div>
    <div class="col-md-12">
        <div class="form-group">
            <strong>Innovation Focus:</strong>
            {{ $project->innovation_focus }}
        </div>
    </div>

    <div class="col-md-12">
        <div class="form-group">
            <strong>Testing Requirements:</strong>
            {{ $project->testing_requirements }}
        </div>
    </div>
    <div class="col-md-12">
        <div class="form-group">
            <strong>Commercialization Plan:</strong>
            {{ $project->commercialization_plan }}
        </div>
    </div>
</div>
@endsection

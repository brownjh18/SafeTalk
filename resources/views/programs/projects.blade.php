@extends('layouts.app')

@section('content')
    <div class="row">
        <div class="col-lg-12 margin-tb">
            <div class="pull-left">
                <h2>Projects for Program: {{ $program->name }}</h2>
            </div>
            <div class="pull-right">
                <a class="btn btn-primary" href="{{ route('programs.index') }}"> Back to Programs</a>
            </div>
        </div>
    </div>

    <div class="row mt-3">
        <div class="col-xs-12 col-sm-12 col-md-12">
            <div class="form-group">
                <strong>Description:</strong>
                <p>{{ $program->description }}</p>
            </div>
        </div>
    </div>

    <hr>
    <h4>Projects List</h4>

    <table class="table table-bordered mt-3">
        <tr>
            <th>No</th>
            <th>Project Title</th>
            <th>Project Description</th>
        </tr>
        @forelse ($projects as $project)
        <tr>
            <td>{{ $loop->iteration }}</td>
            <td>{{ $project->title }}</td>
            <td>{{ $project->description }}</td>
        </tr>
        @empty
        <tr>
            <td colspan="3" class="text-center">
                This program has no projects yet.
                <br><br>
                <a class="btn btn-success" href="{{ route('projects.create', ['program_id' => $program->program_id]) }}">
                Click here to add a project
                </a>
            </td>
        </tr>
        @endforelse
    </table>


@endsection

@extends('layouts.app')

@section('content')
    <div class="row">
        <div class="col-lg-12 margin-tb">
            <div class="pull-left">
                <h2>Projects under: {{ $program->name }}</h2>
                <p class="text-muted">Program ID: {{ $program->program_id }}</p>
            </div>
            <div class="pull-right">
                <a class="btn btn-primary" href="{{ route('programs.index') }}"> Back to Programs</a>
                <a class="btn btn-secondary" href="{{ route('programs.show', $program->program_id) }}"> Program Details</a>
            </div>
        </div>
    </div>

    @if ($program->projects->isEmpty())
        <div class="alert alert-info">No projects found for this program.</div>
    @else
        <table class="table table-bordered mt-3">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Nature</th>
                    <th>Prototype Stage</th>
                    <th>Innovation Focus</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($program->projects as $project)
                    <tr>
                        <td>{{ $loop->iteration }}</td>
                        <td>{{ $project->title }}</td>
                        <td>{{ $project->nature_of_project }}</td>
                        <td>{{ $project->prototype_stage }}</td>
                        <td>{{ $project->innovation_focus }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
@endsection

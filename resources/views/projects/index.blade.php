@extends('layouts.app')

@section('content')
    <div class="row">
        <div class="col-lg-12 margin-tb">
            <div class="pull-left">
                <h2>Projects</h2>
            </div>
            <div class="pull-right mb-2">
                <a class="btn btn-success" href="{{ route('projects.create') }}"> Create New Project</a>
            </div>
        </div>
    </div>

    @if ($message = Session::get('success'))
        <div class="alert alert-success">
            <p>{{ $message }}</p>
        </div>
    @endif

    <table class="table table-bordered">
        <thead>
            <tr>
                <th>No</th>
                <th>Title</th>
                <th>Program</th>
                <th>Nature</th>
                <th>Prototype Stage</th>
                <th width="280px">Action</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($projects as $project)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $project->title }}</td>
                    <td>{{ optional($project->program)->name }}</td>
                    <td>{{ $project->nature_of_project }}</td>
                    <td>{{ $project->prototype_stage }}</td>
                    <td>
                        <form action="{{ route('projects.destroy', $project->project_id) }}" method="POST">
                            <a class="btn btn-info" href="{{ route('projects.show', $project->project_id) }}">Show</a>
                            <a class="btn btn-primary" href="{{ route('projects.edit', $project->project_id) }}">Edit</a>

                            <a class="btn btn-secondary" href="{{ url('projects/' . $project->project_id . '/outcomes') }}">Outcomes</a>
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger">Delete</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endsection

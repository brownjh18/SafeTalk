<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Advanced Programming Capstone</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .bg-card { background-color: white; }
        .dark .bg-card { background-color: rgb(31 41 55); }
        .text-muted-foreground { color: rgb(107 114 128); }
        .dark .text-muted-foreground { color: rgb(156 163 175); }
    </style>
</head>
<body class="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

<div class="min-h-screen">
    @yield('content')
</div>

</body>
</html>
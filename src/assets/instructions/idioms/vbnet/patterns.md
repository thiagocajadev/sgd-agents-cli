# VB.NET — Project Conventions

> Universal principles in `../../core/staff-dna.md`. This file: VB.NET (modern .NET) specific decisions only.

<ruleset name="VbNetConventions">

## Error Handling

- Result Pattern (`Result(Of T)`) as standard; exceptions only for unexpected failures
- Result explicitly returned; exceptions bubble to Global Handler
- Never: `Throw` for business rules; empty `Catch`; leak internal details

```vb
Public Class Result(Of T)
    Public Property IsSuccess As Boolean
    Public Property Data As T
    Public Property ErrorCode As String
    Public Property ErrorMessage As String

    Public Shared Function Success(data As T) As Result(Of T)
        Return New Result(Of T) With { .IsSuccess = True, .Data = data }
    End Function
    Public Shared Function Failure(message As String, code As String) As Result(Of T)
        Return New Result(Of T) With { .IsSuccess = False, .ErrorMessage = message, .ErrorCode = code }
    End Function
End Class
```

## HTTP & API

- ASP.NET Core; vertical slice per feature; MVC acceptable when necessary
- Constructor injection; native ASP.NET Core container; never service locator

## Testing

- xUnit (preferred) or MSTest; naming: `Should_DoX_WhenY`
- Mock only external deps; never mock domain

## Types & Contracts

- `Interface` for contracts; `Class` for implementation; simple DTOs
- `Option Strict On`; `Option Explicit On`; avoid `Nothing` — prefer Result/Option
- DTOs separated from domain; FluentValidation or manual at boundary

## VB.NET-Specific Delta

- No legacy syntax (`On Error Resume Next`, late binding)
- Modern .NET style aligned with C#; `Async/Await` always; never `.Result`/`.Wait()`
- `ILogger` for logging; Option Pattern for config
- PascalCase public; `I` prefix interfaces
- `For Each` for all collection operations

```vb
Dim activeEmails As New List(Of String)
For Each u In users
    If u.IsActive Then activeEmails.Add(u.Email)
Next
```

</ruleset>

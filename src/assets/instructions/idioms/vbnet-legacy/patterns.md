# VB.NET (Legacy .NET Framework 4.8 Desktop) — Project Conventions

> Universal principles in `../../core/staff-dna.md`. This file: VB.NET 4.8 desktop-specific decisions only.

<ruleset name="VbNet48DesktopConventions">

## Error Handling

- Result Pattern (`Result(Of T)`) in domain; `Try/Catch` only for unexpected failures
- Result explicitly returned; exceptions captured at boundary (UI/App) and converted to controlled feedback
- Never: `Throw` for business rules; `On Error Resume Next`; empty `Catch`; stacktrace to user

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

## UI & Application (Desktop)

- UI as orchestrator — no business rules in Form/View
- WinForms → lightweight MVP; WPF → MVVM when applicable
- UI = events + binding; Application/Service = orchestration; Domain = rules
- Never: business rules in Form/View; direct DB from UI; couple UI with infra

## Data Access

- Direct ADO.NET or Dapper (preferred); avoid heavy ORMs (EF6) unless necessary
- Simple repositories per feature; explicit queries
- Explicit transaction control; never unsafe dynamic SQL (string concatenation)

## Testing

- MSTest or xUnit; naming: `Should_DoX_WhenY`
- Mock only external I/O; domain always real

## Types & Contracts

- `Interface` for contracts; `Class` for implementation; simple DTOs
- `Option Strict On`; `Option Explicit On`; avoid `Nothing` — use Result/explicit values
- DTOs separated from domain; validation at boundary

## VB.NET 4.8-Specific Delta

- No legacy syntax (`On Error`, late binding, `IIF`)
- `Async/Await` with care — UI threading considerations (`Invoke`/`BeginInvoke`)
- Structured logging to file or Event Viewer
- Config via `app.config`/`ConfigurationManager`
- Centralize unhandled errors: `Application.ThreadException`/`AppDomain.UnhandledException`
- `For Each` for all collection operations

```vb
Dim activeEmails As New List(Of String)
For Each u In users
    If u.IsActive Then activeEmails.Add(u.Email)
Next
```

</ruleset>

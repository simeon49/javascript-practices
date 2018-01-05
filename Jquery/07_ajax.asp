<%
response.write("This is some text from an external ASP file.")
%>
<%
dim fname,age
fname=Request.Form("name")
age=Request.Form("age")
Response.Write("Dear " & fname & ". ")
Response.Write("Age " & age & ".")
%>
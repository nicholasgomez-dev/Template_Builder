DM-User-Account-Manager
authenticate to oauth with uname/pword in exchange for JWT

authenticate

curl --header "Content-Type: application/json" --request POST --data '{"email_address":"omni2000@mxssolutions.com","pword":"Rssl9254garygrillingbr05!A","authentication_constraints_null":true}' http://127.0.0.1/auth/credentials

create collaborator

curl --header "Content-Type: application/json" --header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6Im9tbmkyMDAwIiwibmFtZSI6Im9tbmkyMDAwQG14c3NvbHV0aW9ucy5jb20iLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvZjU4YzRiMTA2ZTBkZGZjYTM1ZTY4NTFjNTUxM2UwMWE_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZvbS5wbmciLCJ1cGRhdGVkX2F0IjoiMjAyMC0xMS0yOFQwMjo0MjozNS4xNThaIiwiZW1haWwiOiJvbW5pMjAwMEBteHNzb2x1dGlvbnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJodHRwczovL2Rldi02NzNmNGE0bC51cy5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWZiMzQ1NGQzYWIyZTQwMDZlZmQ3ZGM2IiwiYXVkIjoibG1vOXZNdTFiYTZ0Y1dnOTVkVXFQbFlJdlFvQnY0VnIiLCJpYXQiOjE2MDY1MzEzNTUsImV4cCI6MTYwNjU2NzM1NSwiZG1fdXNlcl90eXBlIjoib21uaSJ9.iaHCWnISKqZAq3hMF6oiRTqzu9q7FOzXo0GDXQQgNyQ" --request POST --data '{ "pword":"Rssl9254garygrillingbr05!A","username":"rubberguard22","email_address":"cecovir937@tdcryo.com" }' http://127.0.0.1/api/users/initialize-collaborator

toggle user activation status
curl --header "Content-Type: application/json" --header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6Im9tbmkyMDAwIiwibmFtZSI6Im9tbmkyMDAwQG14c3NvbHV0aW9ucy5jb20iLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvZjU4YzRiMTA2ZTBkZGZjYTM1ZTY4NTFjNTUxM2UwMWE_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZvbS5wbmciLCJ1cGRhdGVkX2F0IjoiMjAyMC0xMi0wOFQxOToxNDo1Ni4xNzJaIiwiZW1haWwiOiJvbW5pMjAwMEBteHNzb2x1dGlvbnMuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJodHRwczovL2Rldi02NzNmNGE0bC51cy5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWZiMzQ1NGQzYWIyZTQwMDZlZmQ3ZGM2IiwiYXVkIjoibG1vOXZNdTFiYTZ0Y1dnOTVkVXFQbFlJdlFvQnY0VnIiLCJpYXQiOjE2MDc0NTQ4OTYsImV4cCI6MTYwNzQ5MDg5NiwiZG1fdXNlcl90eXBlIjoib21uaSJ9.MkWM-mGk-Ndcqxh0t-01BVndE9fnUTXXAm8q5m5pC30" --request POST --data '{ }' http://127.0.0.1/api/users/5fcfda31aad5941b3bef8052/toggle_activation


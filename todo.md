Bugs :-

Features :-



---
TODO =>
0. Fix in sscrensshot api call of user self delete 400 error proplery in users/page.tsx

 GET /dashboard/users 200 in 596ms (next.js: 263ms, proxy.ts: 13ms, application-code: 320ms)
[browser] ⨯ unhandledRejection: AxiosError: Request failed with status code 404
    at async UsersPage.useMutation[deleteUser] [as mutationFn] (app/dashboard/users/page.tsx:158:21)
  156 |       // return res.data;
  157 |       try {
> 158 |         const res = await api.post(`/api/auth/admin/remove-user`, { userId });
      |                     ^
  159 |         return res.data;
  160 |       } catch (err: any) {
  161 |         toast.error("ERROR:", err.response?.data);



0. on profile deleting session whole session is clered still i guess cause of redis still logged for 1 or 2 min => I guess cuase of react client side take times and profile is SSR so its wuick. => Solution : Make global storgae for session and clear manually on session button+api call.
1. organization -> member -> admi -> user => custom rebac role to betterauth merged.
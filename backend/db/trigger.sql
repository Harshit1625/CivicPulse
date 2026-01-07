---------------------------- Trigger for Supabase -------------------------------------------

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, role, created_at)
  values (new.id, 'citizen', now())
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

---------------------------- About this code -------------------------------------------

-- This code creates a PostgreSQL trigger function that runs **automatically every time a new user signs up via Supabase Auth**. 
--  The `create function public.handle_new_user()`
--  defines a function named `handle_new_user` inside the `public` schema, and `returns trigger` means it’s not a normal function—you 
--  can’t call it manually; it’s meant to 
--  be executed by a database trigger. `language plpgsql` tells Postgres to use its procedural SQL language, and `security definer` is critical: 
--  it makes the function run with the **database owner’s privileges**, not the user’s, so it can safely write to the `profiles` table even 
--  though normal users are restricted by RLS. Inside the function body, the `insert into public.profiles (...) values (...)` statement creates a 
--  corresponding profile row for the newly created auth user, using `new.id` (the UUID of the freshly inserted row in `auth.users`) 
--  as the primary key, setting the role to `'citizen'`, and recording the current timestamp with 
--  `now()`. The `on conflict (id) do nothing` clause makes the operation idempotent, meaning if the 
--  profile already exists (for example due to retries or edge cases), the insert is safely skipped instead of crashing. 
--  `return new;` is required for trigger functions and simply hands back the newly inserted auth row so the original insert 
--  can complete. After defining the function, `drop trigger if exists on_auth_user_created on auth.users;` ensures you don’t 
--  end up with duplicate triggers when re-running migrations, and finally `create trigger on_auth_user_created after insert on 
--  auth.users for each row execute procedure public.handle_new_user();` wires everything together so that **every successful 
--  signup automatically creates a matching profile record**, with zero frontend or backend code involved.


-- To Check the running Trigger --

select
  tgname,
  pg_get_triggerdef(oid)
from pg_trigger
where tgrelid = 'auth.users'::regclass
  and not tgisinternal;


---------------------------- About this code -------------------------------------------
-- This query is simply **introspecting PostgreSQL’s system catalog to show you which custom triggers 
-- exist on the `auth.users` table and how they’re defined**. `pg_trigger` is an internal Postgres table 
-- that stores metadata about every trigger in the database; `tgname` pulls the trigger’s name, 
-- while `pg_get_triggerdef(oid)` converts the low-level trigger definition into readable SQL so 
-- humans can understand what it does. The `where tgrelid = 'auth.users'::regclass` part filters 
-- triggers to only those attached to the `auth.users` table (the `::regclass` cast safely resolves 
-- the table name to its internal ID), and `and not tgisinternal` excludes system-managed triggers that 
-- Postgres or Supabase creates automatically, leaving only **user-defined triggers like your 
-- `on_auth_user_created` trigger**. In short, this query is a safe way to audit and verify that 
-- your signup trigger exists, is attached to the correct table, and is doing exactly what you expect—without modifying anything.


---------------------------------------------- Admin Policy -----------------------------------------

-- We coulnd't use this command because the policy tried to read profiles while protecting profiles, causing infinite RLS recursion that Postgres correctly aborts.
-- USING (
--   EXISTS (
--     SELECT 1
--     FROM profiles p
--     WHERE p.id = auth.uid()
--       AND p.role = 'admin'
--   )
-- )

-- We created an alternate function which would explicitly check if the user is admin or not 
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;







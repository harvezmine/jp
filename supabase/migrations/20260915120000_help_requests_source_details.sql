-- Asal formulir (umum, doa, cerita) dan jawaban khusus per formulir,
-- misalnya doa untuk siapa atau pendamping yang diinginkan.
-- Aman untuk kode lama: kedua kolom punya default, jadi insert lama tetap jalan.
alter table help_requests
  add column if not exists source text not null default 'umum'
    check (source in ('umum', 'doa', 'cerita')),
  add column if not exists details jsonb not null default '{}'::jsonb;

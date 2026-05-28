CREATE TABLE "kunden" (
    "id"      TEXT NOT NULL,
    "name"    TEXT NOT NULL,
    "branche" TEXT NOT NULL DEFAULT '',
    "paket"   TEXT NOT NULL DEFAULT 'BASIS',
    "status"  TEXT NOT NULL DEFAULT 'trial',
    "email"   TEXT NOT NULL DEFAULT '',
    "since"   TEXT NOT NULL,
    CONSTRAINT "kunden_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "demos" (
    "id"            TEXT NOT NULL,
    "name"          TEXT NOT NULL,
    "firma"         TEXT NOT NULL,
    "email"         TEXT NOT NULL,
    "telefon"       TEXT NOT NULL,
    "branche"       TEXT NOT NULL,
    "eingegangen"   TEXT NOT NULL,
    "status"        TEXT NOT NULL DEFAULT 'neu',
    "stil"          TEXT,
    "features"      TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "statusWebsite" TEXT,
    CONSTRAINT "demos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "nachrichten" (
    "id"          TEXT NOT NULL,
    "name"        TEXT NOT NULL,
    "email"       TEXT NOT NULL,
    "betreff"     TEXT NOT NULL,
    "text"        TEXT NOT NULL,
    "eingegangen" TEXT NOT NULL,
    "status"      TEXT NOT NULL DEFAULT 'neu',
    CONSTRAINT "nachrichten_pkey" PRIMARY KEY ("id")
);

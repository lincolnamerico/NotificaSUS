CREATE TYPE "public"."classificacao_incidente" AS ENUM('queda', 'medicacao', 'infeccao', 'procedimento', 'equipamento', 'comunicacao', 'sangue', 'nutricao', 'pele', 'outro');--> statement-breakpoint
CREATE TYPE "public"."grau_dano" AS ENUM('leve', 'moderado', 'grave', 'obito');--> statement-breakpoint
CREATE TYPE "public"."papel" AS ENUM('admin', 'gestor', 'visualizador');--> statement-breakpoint
CREATE TYPE "public"."severidade" AS ENUM('baixa', 'media', 'alta', 'critica');--> statement-breakpoint
CREATE TABLE "notificacao" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"protocolo" varchar(20) NOT NULL,
	"usf_id" uuid NOT NULL,
	"tipo_incidente" varchar(100) NOT NULL,
	"classificacao_incidente" "classificacao_incidente",
	"local_especifico" varchar(200),
	"data_hora" timestamp with time zone NOT NULL,
	"descricao" text NOT NULL,
	"grau_dano" "grau_dano" NOT NULL,
	"severidade" "severidade",
	"acoes_tomadas" text,
	"anonimo" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "notificacao_protocolo_unique" UNIQUE("protocolo")
);
--> statement-breakpoint
CREATE TABLE "usf" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(50) NOT NULL,
	"nome" varchar(200) NOT NULL,
	"endereco" text,
	"ativo" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "usf_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "usuario" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"nome" varchar(200) NOT NULL,
	"papel" "papel" DEFAULT 'gestor',
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "usuario_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "notificacao" ADD CONSTRAINT "notificacao_usf_id_usf_id_fk" FOREIGN KEY ("usf_id") REFERENCES "public"."usf"("id") ON DELETE no action ON UPDATE no action;
--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2
-- Dumped by pg_dump version 12.2

-- Started on 2020-04-16 21:15:00

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 209 (class 1259 OID 16473)
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    cart_id integer NOT NULL,
    product_id integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    quantity integer DEFAULT 1
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 16471)
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cart_items_id_seq OWNER TO postgres;

--
-- TOC entry 2856 (class 0 OID 0)
-- Dependencies: 208
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- TOC entry 207 (class 1259 OID 16462)
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    cart_id integer NOT NULL,
    session_key text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.carts OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 16460)
-- Name: carts_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carts_cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.carts_cart_id_seq OWNER TO postgres;

--
-- TOC entry 2857 (class 0 OID 0)
-- Dependencies: 206
-- Name: carts_cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carts_cart_id_seq OWNED BY public.carts.cart_id;


--
-- TOC entry 205 (class 1259 OID 16451)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    quantity integer NOT NULL,
    price real NOT NULL,
    description text NOT NULL,
    image character varying(200) NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 16449)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 2858 (class 0 OID 0)
-- Dependencies: 204
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 2709 (class 2604 OID 16476)
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- TOC entry 2706 (class 2604 OID 16465)
-- Name: carts cart_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts ALTER COLUMN cart_id SET DEFAULT nextval('public.carts_cart_id_seq'::regclass);


--
-- TOC entry 2703 (class 2604 OID 16454)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 2850 (class 0 OID 16473)
-- Dependencies: 209
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (id, cart_id, product_id, "createdAt", "updatedAt", quantity) FROM stdin;
9	1	2	2020-04-17 01:37:09.701	2020-04-17 01:37:09.701	1
10	1	1	2020-04-17 01:47:07.236	2020-04-17 01:47:07.236	1
11	1	3	2020-04-17 01:48:20.403	2020-04-17 01:48:20.403	1
12	1	4	2020-04-17 01:49:15.677	2020-04-17 01:49:15.677	1
13	1	5	2020-04-17 01:49:18.046	2020-04-17 01:49:20.437	2
14	1	6	2020-04-17 01:57:37.415	2020-04-17 01:57:37.415	1
\.


--
-- TOC entry 2848 (class 0 OID 16462)
-- Dependencies: 207
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts (cart_id, session_key, "createdAt", "updatedAt") FROM stdin;
1	eeb8076d-8e3f-408f-b79b-816bd4e836ed	2020-04-15 21:06:12.548905	2020-04-15 21:06:12.548905
2	dcbda148-f351-43e0-9e8a-5c2f4643db5c	2020-04-15 21:06:12.548905	2020-04-15 21:06:12.548905
\.


--
-- TOC entry 2846 (class 0 OID 16451)
-- Dependencies: 205
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, quantity, price, description, image, "createdAt", "updatedAt") FROM stdin;
1	Product 1	7	26.99	A product.	product1.jpg	2020-04-15 18:37:33.765173	2020-04-15 18:37:33.765173
2	Product 2	23	9.99	Another product.	product2.jpg	2020-04-15 18:37:33.765173	2020-04-15 18:37:33.765173
3	Product 3	55	10.5	Wow, that's some product.	product3.jpg	2020-04-15 18:37:33.765173	2020-04-15 18:37:33.765173
4	Product 4	43	6	Cheap product.	product4.jpg	2020-04-15 18:37:33.765173	2020-04-15 18:37:33.765173
5	Product 5	12	56	Expensive product.	product5.jpg	2020-04-15 18:37:33.765173	2020-04-15 18:37:33.765173
6	Product 6	3	31.26	Man we're kind of running out of these, huh?	product6.jpg	2020-04-15 18:37:33.765173	2020-04-15 18:37:33.765173
7	Product 7	123	5.49	Oh wow this is even cheaper.	product7.jpg	2020-04-15 18:37:33.765173	2020-04-15 18:37:33.765173
8	Product 8	453	10.69	Nice.	product8.jpg	2020-04-15 18:37:33.765173	2020-04-15 18:37:33.765173
9	Product 9	65	0.99	Dollar store shelf material v2.0.	product9.jpg	2020-04-15 18:37:33.765173	2020-04-15 18:37:33.765173
10	Product 10	34	12	Just your average product.	product10.jpg	2020-04-15 18:37:33.765173	2020-04-15 18:37:33.765173
\.


--
-- TOC entry 2859 (class 0 OID 0)
-- Dependencies: 208
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 14, true);


--
-- TOC entry 2860 (class 0 OID 0)
-- Dependencies: 206
-- Name: carts_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carts_cart_id_seq', 2, true);


--
-- TOC entry 2861 (class 0 OID 0)
-- Dependencies: 204
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 1, false);


--
-- TOC entry 2718 (class 2606 OID 16478)
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- TOC entry 2716 (class 2606 OID 16470)
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (cart_id);


--
-- TOC entry 2714 (class 2606 OID 16459)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


-- Completed on 2020-04-16 21:15:00

--
-- PostgreSQL database dump complete
--


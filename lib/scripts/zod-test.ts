import { z } from 'zod';

//const id = 'X9_l7IdvRq26r7e';
const id = 'BF4SLSp6QQaJEyzU5rpw';
const schema = z
	.base64url()
	.refine((val) => /^[A-Za-z0-9_-]{22}$/.test(val), { message: 'Invalid base64url-encoded UUID format' });
console.log(schema.parse(id));

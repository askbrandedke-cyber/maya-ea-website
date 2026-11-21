/** Prints every current-pack photo URL; pipe to curl to check they resolve. */
import { products } from "../content/products";
for (const p of products) console.log(`${p.slug} ${p.currentPhoto}`);

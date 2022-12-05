// plugins/vuetify.js
import { Ulid, Uuid4 } from 'id128';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      uuid: () => Uuid4.construct(Ulid.generate().bytes).toCanonical(),
    },
  };
});

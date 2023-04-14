<template>
  <v-breadcrumbs :items="items"> </v-breadcrumbs>
</template>

<script lang="ts" setup>
const breadcrumbs = useBreadcrumbs();

const items = computed(() => {
  return breadcrumbs.value
    .map((breadcrumb, index) => {
      return {
        title: breadcrumb.title,
        disabled: breadcrumbs.value.length - 1 === index,
        to: breadcrumb.to,
      };
    })
    .slice(1);
});

const router = useRouter();
console.log(router.getRoutes());

import { hasTrailingSlash, parseURL, stringifyParsedURL, withTrailingSlash } from 'ufo';

const getBreadcrumbs = (input: string) => {
  const startNode = parseURL(input);
  const appendsTrailingSlash = hasTrailingSlash(startNode.pathname);

  const stepNode = (node: ParsedURL, nodes: string[] = []) => {
    const fullPath = stringifyParsedURL(node);
    // the pathname will always be without the trailing slash
    const currentPathName = node.pathname;
    // when we hit the root the path will be an empty string; we swap it out for a slash
    nodes.push(fullPath || '/');
    // strip the last path segment (/my/cool/path -> /my/cool)
    node.pathname = currentPathName.substring(0, currentPathName.lastIndexOf('/'));
    // if the input was provided with a trailing slash we need to honour that
    if (appendsTrailingSlash)
      node.pathname = withTrailingSlash(node.pathname.substring(0, node.pathname.lastIndexOf('/')));

    // if we still have a pathname, and it's different, traverse
    if (node.pathname !== currentPathName) stepNode(node, nodes);
    return nodes;
  };
  return stepNode(startNode);
};

console.log(getBreadcrumbs(router.currentRoute.value.path));
</script>

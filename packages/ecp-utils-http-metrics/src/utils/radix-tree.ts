type Children = Record<string, RadixTreeNode>;

class RadixTreeNode {
  children: Children;
  isEndOfRoute: boolean;
  route: string | null;

  constructor() {
    this.children = {};
    this.isEndOfRoute = false;
    this.route = null;
  }
}

export class RadixTree {
  root: RadixTreeNode;

  constructor() {
    this.root = new RadixTreeNode();
  }

  insert(route: string): void {
    const segments = route.split('/');
    let node = this.root;

    for (const segment of segments) {
      if (!node.children[segment]) {
        node.children[segment] = new RadixTreeNode();
      }
      node = node.children[segment];
    }

    node.isEndOfRoute = true;
    node.route = route;
  }

  search(url: string): { route: string; params: { [key: string]: string } } | null {
    const segments = url.split('/');
    let node = this.root;
    const params: { [key: string]: string } = {};

    for (const segment of segments) {
      if (node.children[segment]) {
        node = node.children[segment];
      } else {
        const dynamicKey = Object.keys(node.children).find((key) => key.startsWith(':'));
        if (dynamicKey) {
          params[dynamicKey.slice(1)] = segment;
          node = node.children[dynamicKey];
        } else {
          return null;
        }
      }
    }

    return node.isEndOfRoute ? { route: node.route as string, params } : null;
  }
}

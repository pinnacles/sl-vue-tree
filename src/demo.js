import { createApp } from 'vue/dist/vue.esm-bundler.js'

import SlVueTree from './sl-vue-tree.vue'

var nodes = [
  {title: 'Item1', isLeaf: true},
  {title: 'Item2', isLeaf: true, data: { visible: false }},
  {title: 'Folder1'},
  {
    title: 'Folder2', isExpanded: true, children: [
      {title: 'Item3', isLeaf: true},
      {title: 'Item4', isLeaf: true},
      {
        title: 'Folder3', children: [
          {title: 'Item5', isLeaf: true}
        ]
      }
    ]
  },
  {title: 'Folder5', isExpanded: false},
  {title: 'Item6', isLeaf: true},
  {title: 'Item7', isLeaf: true, data: { visible: false }},
  {
    title: 'Folder6', children: [
      {
        title: 'Folder7', children: [
          {title: 'Item8', isLeaf: true},
          {title: 'Item9', isLeaf: true}
        ]
      }
    ]
  }
];

const App = {
  components: { SlVueTree },
  data: function () {
   return {
     nodes: nodes,
     contextMenuIsVisible: false,
     lastEvent: 'No last event',
     selectedNodesTitle: '',
   }
  },

  mounted() {
    // expose instance to the global namespace
    window.slVueTree = this.$refs.slVueTree;
  },

  methods: {

    toggleVisibility: function (event, node) {
      const slVueTree = this.$refs.slVueTree;
      event.stopPropagation();
      const visible = !node.data || node.data.visible !== false;
      slVueTree.updateNode(node.path, {data: { visible: !visible}});
      this.lastEvent = `Node ${node.title} is ${ visible ? 'visible' : 'invisible'} now`;
    },

    nodeSelected(nodes, event) {
      this.selectedNodesTitle = nodes.map(node => node.title).join(', ');
      this.lastEvent = `Select nodes: ${this.selectedNodesTitle}`;
    },

    nodeToggled(node, event) {
      this.lastEvent = `Node ${node.title} is ${ node.isExpanded ? 'expanded' : 'collapsed'}`;
    },

    nodeDropped(nodes, position, event) {
      this.lastEvent = `Nodes: ${nodes.map(node => node.title).join(', ')} are dropped ${position.placement} ${position.node.title}`;
    },

    showContextMenu(node, event) {
      event.preventDefault();
      this.contextMenuIsVisible = true;
      const $contextMenu = this.$refs.contextmenu;
      $contextMenu.style.left = event.clientX + 'px';
      $contextMenu.style.top = event.clientY + 'px';
    },

    removeNode() {
      this.contextMenuIsVisible = false;
      const $slVueTree = this.$refs.slVueTree;
      const paths = $slVueTree.getSelected().map(node => node.path);
      $slVueTree.remove(paths);
    }
  }
}

createApp(App).mount('#app');
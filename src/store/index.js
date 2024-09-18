import { makeAutoObservable } from 'mobx';
class MentionableStore {
  content = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Hello, this is a simple example of TipTap JSON content.',
          },
        ],
      },
    ],
  };

  constructor() {
    makeAutoObservable(this);
  }

  setInputValue(value) {
    this.content = value;
  }

  renderHTML(node) {
    let html = '';

    // Handle different node types
    switch (node.type) {
      case 'doc':
        // Process the document's content
        node.content.forEach((childNode) => {
          html += renderHTML(childNode);
        });
        break;

      case 'paragraph':
        // Handle paragraph element
        html += '<p>';
        if (node.content) {
          node.content.forEach((childNode) => {
            html += renderHTML(childNode);
          });
        }
        html += '</p>';
        break;

      case 'heading':
        // Handle heading element with levels
        const level = node.attrs?.level || 1;
        html += `<h${level}>`;
        if (node.content) {
          node.content.forEach((childNode) => {
            html += renderHTML(childNode);
          });
        }
        html += `</h${level}>`;
        break;

      case 'bulletList':
        // Handle unordered list
        html += '<ul>';
        node.content.forEach((childNode) => {
          html += renderHTML(childNode);
        });
        html += '</ul>';
        break;

      case 'listItem':
        // Handle list item
        html += '<li>';
        if (node.content) {
          node.content.forEach((childNode) => {
            html += renderHTML(childNode);
          });
        }
        html += '</li>';
        break;

      case 'text':
        // Handle text node
        html += node.text || '';
        break;

      default:
        break;
    }

    return html;
  }
}

const mentionableStore = new MentionableStore();
export default mentionableStore;

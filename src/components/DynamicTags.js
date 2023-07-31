import React, { Component } from 'react';
import DraftsIcon from '@mui/icons-material/Drafts';
import InboxIcon from '@mui/icons-material/Inbox';

class DynamicTags extends Component {
    components = {
        0: DraftsIcon,
        1: InboxIcon
    };
    render() {
       const TagName = this.components[this.props.tag || "0"];
       return <TagName />
    }
}
export default DynamicTags;
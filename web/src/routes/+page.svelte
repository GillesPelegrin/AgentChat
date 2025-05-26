<script>
    import { initConversation } from "../lib/component/conversation.js";
    import { initMessage } from "../lib/component/message.js";
    import { initPersonas } from "../lib/component/personas.js";
    import { initProvider } from "../lib/component/provider.js";
    import { initElements } from "../lib/element.js";
    import { loadStateFromLocalStorage } from "../lib/localStorage.js";

    import { onMount } from "svelte";
    import Chatwindow from "./components/chatwindow.svelte";
    import Sidebar from "./components/sidebar.svelte";

    // Initialize application
    function init() {
        // Load saved state
        loadStateFromLocalStorage();
        initElements();

        initMessage();
        initPersonas();
        initConversation();
        initProvider();
    }

    onMount(() => {
        // Code that uses the document object
        init();
    });
</script>

<Sidebar />
<Chatwindow />

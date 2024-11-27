<script>
    import "../app.css";
    import { onMount, onDestroy } from "svelte";
    import { currentUser, pb } from "./pocketbase.js";

    let newMessage;
    let messages = [];
    let unsubscribe;
    let unsubscribeGroups;
    let users = [];
    let chatContainer;
    let searchQuery;
    let groupChats;
    let showUserList = false;
    let groupMembers = [];
    let groupName;

    async function sendMessage() {
        if (!$currentUser) return;

        const userName = window.location.pathname
            .replace("/", "")
            .replaceAll("%20", " ");
        groupChats = await pb.collection("groups").getFullList({
            filter: `members ~ "${$currentUser.id}"`,
        });
        const groupChat = groupChats?.find((chat) => chat.name === userName);
        if (groupChat) {
            const receiver = groupChat.members;

            const data = {
                message: newMessage,
                sender: $currentUser.id,
                receiver: receiver,
                group: groupChat.id,
            };

            await pb.collection("chats").create(data);
            newMessage = "";
        } else {
            const receiver = users.find((user) => user.username === userName);

            const data = {
                message: newMessage,
                sender: $currentUser.id,
                receiver: receiver.id,
            };
            await pb.collection("chats").create(data);
            newMessage = "";
        }

        setTimeout(scrollToBottom, 100);
    }

    function getImageUrl(record, fileName) {
        if (fileName) {
            return pb.files.getUrl(record, fileName, { thumb: "100x250" });
        }
    }

    async function fetchUsers() {
        users = await pb.collection("users").getFullList();
    }

    async function fetchMessages() {
        const userName = window.location.pathname
            .replace("/", "")
            .replaceAll("%20", " ");
        if (userName.length > 0) {
            groupChats = await pb.collection("groups").getFullList({
                filter: `members ~ "${$currentUser.id}"`,
            });
            const groupChat = groupChats?.find(
                (chat) => chat.name === userName,
            );
            if (groupChat) {
                const messagesList = await pb
                    .collection("chats")
                    .getList(1, 50, {
                        sort: "created",
                        filter: `group.id = "${groupChat.id}"`,
                    });

                const messagesWithUsername = messagesList.items.map(
                    (message) => {
                        const sender = users.find(
                            (user) => user.id === message.sender,
                        );
                        return {
                            ...message,
                            userName: sender ? sender.name : null,
                        };
                    },
                );
                messages = messagesWithUsername;
            } else {
                const receiver = users.find(
                    (user) => user.username === userName,
                );
                const messagesList = await pb
                    .collection("chats")
                    .getList(1, 50, {
                        sort: "created",
                        filter: `(sender.id = "${$currentUser.id}" && receiver.id = "${receiver.id}") || (sender.id = "${receiver.id}" && receiver.id = "${$currentUser.id}")`,
                    });

                messages = messagesList.items;
            }

            setTimeout(scrollToBottom, 100);
        }
    }

    async function fetchGroups() {
        groupChats = await pb.collection("groups").getFullList({
            filter: `members ~ "${$currentUser.id}"`,
        });
    }

    async function createGroup() {
        const data = {
            name: groupName,
            members: groupMembers,
            admin: $currentUser.id,
        };
        await pb.collection("groups").create(data);
    }

    function scrollToBottom() {
        if (chatContainer) {
            chatContainer.scrollTo({
                top: chatContainer.scrollHeight,
                behavior: "smooth",
            });
        }
    }

    onMount(async () => {
        searchQuery = "";
        await fetchUsers();
        await fetchMessages();
        await fetchGroups();
        unsubscribe = await pb
            .collection("chats")
            .subscribe("*", async ({ action, record }) => {
                if (action === "create") {
                    const user = await pb
                        .collection("users")
                        .getOne(record.sender);
                    record.expand = { user };
                    await fetchMessages();
                    setTimeout(scrollToBottom, 100);
                }
            });

        unsubscribeGroups = await pb
            .collection("groups")
            .subscribe("*", async ({ action, record }) => {
                if (action === "create") {
                    await fetchGroups();
                    setTimeout(scrollToBottom, 100);
                }
            });
    });

    onDestroy(() => {
        if (unsubscribe || unsubscribeGroups) {
            unsubscribe();
            unsubscribeGroups();
        }
    });
</script>

<div class="flex flex-col h-screen">
    <div class="flex flex-col md:flex-row flex-1 overflow-hidden">
        <div
            class="w-full md:w-1/4 p-4 bg-gray-100 overflow-y-auto scrollbar-hide flex flex-col"
        >
            <div class="mb-4">
                <div class="flex flex-row justify-between items-center">
                    <p class="text-lg font-semibold mb-2">Chats</p>
                    <div class="relative -mt-2">
                        <button
                            on:click={() => (showUserList = !showUserList)}
                            type="button"
                            class="flex items-center space-x-2 text-white px-4 py-2 rounded-lg"
                            aria-label="Create New Group"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="2em"
                                height="2em"
                                viewBox="0 0 21 21"
                            >
                                <g
                                    fill="none"
                                    fill-rule="evenodd"
                                    stroke="black"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path
                                        d="M10 4.5H5.5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V11"
                                    />
                                    <path
                                        d="M17.5 3.467a1.46 1.46 0 0 1-.017 2.05L10.5 12.5l-3 1l1-3l6.987-7.046a1.41 1.41 0 0 1 1.885-.104zm-2 2.033l.953 1"
                                    />
                                </g>
                            </svg>
                        </button>
                        {#if showUserList}
                            <div
                                class="absolute z-10 w-64 mt-2 bg-white border rounded-lg shadow-lg"
                            >
                                <div class="p-3 border-b">
                                    <input
                                        type="text"
                                        placeholder="Group Name"
                                        bind:value={groupName}
                                        class="w-full p-2 border rounded-lg"
                                    />
                                </div>
                                <div class="max-h-60 overflow-y-auto">
                                    {#each users as user (user.id)}
                                        <div
                                            class="flex items-center p-3 hover:bg-gray-100"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={groupMembers.includes(
                                                    user.id,
                                                )}
                                                on:change={() => {
                                                    if (
                                                        groupMembers.includes(
                                                            user.id,
                                                        )
                                                    ) {
                                                        groupMembers =
                                                            groupMembers.filter(
                                                                (id) =>
                                                                    id !==
                                                                    user.id,
                                                            );
                                                    } else {
                                                        groupMembers = [
                                                            ...groupMembers,
                                                            user.id,
                                                        ];
                                                    }
                                                }}
                                                class="mr-3"
                                            />
                                            <span>{user.name}</span>
                                        </div>
                                    {/each}
                                </div>
                                <div class="p-3 border-t">
                                    <button
                                        class="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                        on:click={async () => {
                                            if (
                                                groupName &&
                                                groupMembers.length > 0
                                            ) {
                                                await createGroup();
                                                showUserList = false;
                                            }
                                        }}
                                    >
                                        Create Group
                                    </button>
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
                <input
                    type="text"
                    placeholder="Search users..."
                    bind:value={searchQuery}
                    class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div class="flex-1">
                {#each users.filter((user) => user.name
                        .toLowerCase()
                        .includes(searchQuery?.toLowerCase() || "")) as user (user.id)}
                    <div class="mb-2">
                        <a
                            href={user.username}
                            class="block p-3 rounded-lg hover:bg-gray-200 transition-colors {window.location.pathname
                                .replace('/', '')
                                .replaceAll('%20', ' ') === user.username
                                ? 'bg-blue-100'
                                : ''}"
                        >
                            {#if user.id === $currentUser.id}
                                <span class="font-medium"
                                    >{user.name}
                                    <span class="text-gray-500">(you)</span
                                    ></span
                                >
                            {:else}
                                <span class="font-medium">{user.name}</span>
                            {/if}
                        </a>
                    </div>
                {/each}
                {#each groupChats?.filter((name) => name.name
                        .toLowerCase()
                        .includes(searchQuery?.toLowerCase() || "")) as groupChat (groupChat.id)}
                    <div class="mb-2">
                        <a
                            href={groupChat.name}
                            class="block p-3 rounded-lg hover:bg-gray-200 transition-colors {window.location.pathname
                                .replace('/', '')
                                .replaceAll('%20', ' ') === groupChat.name
                                ? 'bg-blue-100'
                                : ''}"
                        >
                            <span class="font-medium">{groupChat.name}</span>
                        </a>
                    </div>
                {/each}
            </div>
            <button
                on:click={() => pb.authStore.clear()}
                class="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
                Logout
            </button>
        </div>
        <div class="flex flex-col flex-1 h-full">
            {#if window.location.pathname
                .replace("/", "")
                .replaceAll("%20", " ").length > 0}
                <div class="p-4 bg-white border-b">
                    <div class="flex items-center gap-3">
                        <img
                            src={getImageUrl(
                                users.find(
                                    (user) =>
                                        user.username ===
                                        window.location.pathname
                                            .replace("/", "")
                                            .replaceAll("%20", " "),
                                ) ||
                                    groupChats?.find(
                                        (group) =>
                                            group.name ===
                                            window.location.pathname
                                                .replace("/", "")
                                                .replaceAll("%20", " "),
                                    ),
                                users.find(
                                    (user) =>
                                        user.username ===
                                        window.location.pathname
                                            .replace("/", "")
                                            .replaceAll("%20", " "),
                                )?.avatar ||
                                    groupChats?.find(
                                        (group) =>
                                            group.name ===
                                            window.location.pathname
                                                .replace("/", "")
                                                .replaceAll("%20", " "),
                                    )?.image,
                            )}
                            alt="User avatar"
                            class="w-10 h-10 rounded-full"
                        />
                        <h2 class="text-lg font-semibold">
                            {users.find(
                                (user) =>
                                    user.username ===
                                    window.location.pathname
                                        .replace("/", "")
                                        .replaceAll("%20", " "),
                            )?.name ||
                                groupChats?.find(
                                    (group) =>
                                        group.name ===
                                        window.location.pathname
                                            .replace("/", "")
                                            .replaceAll("%20", " "),
                                )?.name ||
                                "Chat"}
                        </h2>
                    </div>
                </div>
            {/if}
            <div
                class="flex-1 p-4 overflow-y-auto scrollbar-hide bg-gray-50 no-scrollbar"
                bind:this={chatContainer}
            >
                {#if window.location.pathname
                    .replace("/", "")
                    .replaceAll("%20", " ").length > 0}
                    {#if messages.length > 0}
                        {#each messages as message (message.id)}
                            <div class="flex mb-4">
                                {#if message.sender === $currentUser.id}
                                    <div class="ml-auto">
                                        <p
                                            class="text-xs text-gray-500 mb-1 text-right"
                                        >
                                            {message.userName}
                                        </p>
                                        <div class="flex items-end gap-1">
                                            <p
                                                class="bg-[#dcf8c6] text-black p-3 rounded-lg max-w-[80vw] md:max-w-md break-words rounded-tr-none shadow-sm"
                                            >
                                                {message.message}
                                            </p>
                                        </div>
                                    </div>
                                {:else}
                                    <div class="mr-auto">
                                        <p class="text-xs text-gray-500 mb-1">
                                            {message.userName}
                                        </p>
                                        <div class="flex items-end gap-1">
                                            <p
                                                class="bg-white text-black p-3 rounded-lg max-w-[80vw] md:max-w-md break-words rounded-tl-none shadow-sm"
                                            >
                                                {message.message}
                                            </p>
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    {:else}
                        <div class="flex items-center justify-center h-full">
                            <h4 class="text-gray-500 text-lg">
                                No messages yet
                            </h4>
                        </div>
                    {/if}
                {:else}
                    <div class="flex items-center justify-center h-full">
                        <h4 class="text-gray-500 text-lg">
                            End-to-end encrypted
                        </h4>
                    </div>
                {/if}
            </div>
            <div class="p-4 border-t">
                <form on:submit|preventDefault={sendMessage} class="flex gap-2">
                    <input
                        placeholder="Message"
                        type="text"
                        bind:value={newMessage}
                        class="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" aria-label="Upload file">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="2em"
                            height="2em"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="1.5"
                                d="M19.5 12v1.5a7.5 7.5 0 0 1-15 0V8a5 5 0 0 1 10 0v5.5a2.5 2.5 0 0 1-5 0v-4"
                                color="currentColor"
                            />
                        </svg>
                    </button>
                    <button
                        type="submit"
                        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
                        >Send</button
                    >
                </form>
            </div>
        </div>
    </div>
</div>

<style>
    .no-scrollbar {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
</style>

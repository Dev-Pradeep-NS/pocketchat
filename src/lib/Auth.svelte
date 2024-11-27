<script lang="ts">
    import "../app.css";
    import Messages from "./Messages.svelte";
    import { currentUser, pb } from "./pocketbase.js";

    let email: string;
    let password: string;
    let name: string;
    let isLogin = true;

    const login = async () => {
        try {
            await pb.collection("users").authWithPassword(email, password);
        } catch (error) {
            console.log("Login failed: ", error);
        }
    };

    const signUp = async () => {
        try {
            const userName = `${name}_${Math.floor(Math.random() * 10000)}`;
            const fileInput = document.getElementById(
                "fileInput",
            ) as HTMLInputElement;
            const formData = new FormData();

            if (fileInput.files && fileInput.files.length > 0) {
                formData.append("avatar", fileInput.files[0]);
            }

            formData.append("username", userName);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("passwordConfirm", password);
            formData.append("name", name);

            await pb.collection("users").create(formData);
            await login();
        } catch (error) {
            console.log("Unable to create user: ", error);
        }
    };
</script>

{#if $currentUser}
    <Messages />
{:else}
    <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div class="w-full max-w-md">
            <form
                on:submit|preventDefault
                class="bg-white rounded-lg shadow-lg p-8 space-y-6"
            >
                <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
                    {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <div class="space-y-4">
                    {#if !isLogin}
                        <input
                            type="text"
                            placeholder="Name"
                            required
                            bind:value={name}
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <div class="space-y-2">
                            <label
                                for="fileInput"
                                class="block text-sm font-medium text-gray-700"
                                >Profile Picture</label
                            >
                            <input
                                type="file"
                                name="avatar"
                                id="fileInput"
                                accept="image/*"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    {/if}
                    <input
                        type="email"
                        placeholder="Email ID"
                        required
                        bind:value={email}
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        bind:value={password}
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
                <div class="pt-4">
                    <button
                        type="button"
                        on:click={isLogin ? login : signUp}
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-semibold shadow-md hover:shadow-lg"
                    >
                        {isLogin ? "Login" : "Sign Up"}
                    </button>
                </div>
                <div class="text-center text-sm text-gray-600">
                    {#if isLogin}
                        Don't have an account?
                        <button
                            type="button"
                            class="text-blue-600 hover:underline"
                            on:click={() => (isLogin = false)}
                        >
                            Sign up
                        </button>
                    {:else}
                        Already have an account?
                        <button
                            type="button"
                            class="text-blue-600 hover:underline"
                            on:click={() => (isLogin = true)}
                        >
                            Login
                        </button>
                    {/if}
                </div>
            </form>
        </div>
    </div>
{/if}

<template>
    <div>
        <div class="flex">
            <heading class="mb-6 flex-grow">
                Failed Job Manager
            </heading>
            <button class="h-8 bg-blue text-white px-2 rounded shadow ml-4" @click.prevent="refreshJobList">
                Refresh Job List
            </button>
            <button class="h-8 bg-blue text-white px-2 rounded shadow ml-4" @click.prevent="toggleVendorTrace">
                {{ showVendorTrace ? 'Hide' : 'Show' }} Vendor Trace
            </button>
        </div>

        <div v-if="!loading">
            <nova-trace-card v-for="job in failedJobs.data" :job="job" :show-vendor-trace="showVendorTrace" :key="job.id"></nova-trace-card>
        </div>
        <div v-else class="text-center">
            <svg class="spin-the-thing h-16 w-16 text-grey-darkest" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 3v2a5 5 0 0 0-3.54 8.54l-1.41 1.41A7 7 0 0 1 10 3zm4.95 2.05A7 7 0 0 1 10 17v-2a5 5 0 0 0 3.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z"/></svg>
        </div>

        <nav class="flex">
            <button rel="prev"
                    class="btn btn-link py-3 px-4"
                    :class="{
                        'text-primary dim': hasPreviousPage,
                        'text-80 opacity-50': !hasPreviousPage,
                    }"
                    :disabled="!hasPreviousPage"
                    @click.prevent="loadPreviousPage()">
                Previous
            </button>

            <button rel="next"
                    class="ml-auto btn btn-link py-3 px-4"
                    :class="{
                        'text-primary dim': hasNextPage,
                        'text-80 opacity-50': !hasNextPage,
                    }"
                    :disabled="!hasNextPage"
                    @click.prevent="loadNextPage()">
                Next
            </button>
        </nav>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                failedJobs: [],
                showVendorTrace: false,
                loading: true,
                page: 1,
            }
        },
        computed: {
            path() {
                return '/nova-vendor/kregel/nova-failed-jobs/failed-jobs?page=' + this.page;
            },
            hasNextPage() {
                return !!this.failedJobs.next_page_url;
            },
            hasPreviousPage() {
                return !!this.failedJobs.prev_page_url;
            },
        },
        methods: {
            getFailedJobs() {
                this.failedJobs = [];
                this.loading = true;
                Nova.request().get(this.path)
                    .then(res => {
                        this.failedJobs = res.data;
                        this.highlight()
                        this.loading = false;
                    })
                    .catch(err => {
                        this.$toasted.show(err.response.data.message, { type: 'error' })
                    });
            },
            loadNextPage() {
                this.page++;
                this.getFailedJobs();
            },
            loadPreviousPage() {
                this.page--;
                this.getFailedJobs();
            },
            refreshJobList() {
                this.page = 1;
                this.getFailedJobs();
            },
            toggleVendorTrace() {
                this.showVendorTrace = !this.showVendorTrace;
                this.highlight()
            },
            highlight() {
                setTimeout(() => Prism.highlightAll(), 10);
            }
        },
        mounted() {
            this.getFailedJobs();
            RunPrism()
        }
    }
</script>

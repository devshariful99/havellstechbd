import { Head, useForm } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

export default function AdminLogin() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.login.store'));
    };

    return (
        <AuthLayout
            title="Admin Access"
            description="Enter your admin credentials to continue"
        >
            <Head title="Admin Login" />

            <div className="w-full space-y-6 md:space-y-8 lg:space-y-10 px-2 py-6 lg:py-12">
                <form onSubmit={submit} className="space-y-4 px-1 sm:space-y-6 sm:px-0">
                    <div className="space-y-4 sm:space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white text-foreground shadow-sm animate-fade-in-up sm:p-6">
                            <Label
                                htmlFor="email"
                                className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 mb-2 block"
                            >
                                Email address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoFocus
                                placeholder="admin@company.com"
                                className="mt-2 h-11 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#c3102e] focus-visible:ring-2 focus-visible:ring-[#c3102e]/20 sm:h-12 sm:text-base transition-all duration-200"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-foreground shadow-sm animate-fade-in-up delay-100 sm:p-6">
                            <Label
                                htmlFor="password"
                                className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 mb-2 block"
                            >
                                Password
                            </Label>
                            <PasswordInput
                                id="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                placeholder="••••••••"
                                className="mt-2 h-11 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#c3102e] focus-visible:ring-2 focus-visible:ring-[#c3102e]/20 sm:h-12 sm:text-base transition-all duration-200"
                            />
                            <InputError message={errors.password} />
                        </div>
                    </div>

                    <div className="space-y-4 sm:space-y-4">
                        <Button
                            type="submit"
                            className="group relative w-full overflow-hidden rounded-2xl bg-[#c3102e] py-4 text-sm font-semibold tracking-wide text-white shadow-lg transition-all duration-300 hover:bg-[#a00d26] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] sm:py-5 sm:text-base"
                            disabled={processing}
                        >
                            <span className="relative flex items-center justify-center gap-2">
                                {processing ? (
                                    <Spinner className="h-4 w-4" />
                                ) : (
                                    <>
                                        <span>Admin Login</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2.5}
                                            stroke="currentColor"
                                            className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M13.5 4.5 21 12l-7.5 7.5M21 12H3"
                                            />
                                        </svg>
                                    </>
                                )}
                            </span>
                        </Button>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}

import AppNavbar from "@/components/molecules/AppNavbar";

export default function FloatingNavbar() {
	return (
		<div className="fixed top-0 left-0 right-0 h-auto bg-background z-50">
			<div className="mt-5 mb-5 px-5 mx-auto z-50 max-w-7xl">
				<AppNavbar/>
			</div>
		</div>
	)
}
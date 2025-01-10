import AppSlider from "@/components/AppSlider";
import FloatingNavbar from "@/components/organisms/FloatingNavbar";
import LogoutButton from "@/components/LogoutButton";

export default function MainPage() {
	return (
		<>
			<div className="max-w-7xl mx-auto px-5">
				<FloatingNavbar />
				<AppSlider />
				<LogoutButton />
			</div>
		</>
	);
}
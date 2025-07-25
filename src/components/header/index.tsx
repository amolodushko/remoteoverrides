import Settings from "../settings"

interface HeaderProps {
  onSettingsClick: () => void;
}

const Header = ({ onSettingsClick }: HeaderProps) => {
  return (
    <div className="flex flex-row justify-between gap-4 items-center">
      <h2 className="text-xl font-bold text-gray-700">
        Via Remote Override manager
      </h2>
      <Settings onClick={onSettingsClick} />
    </div>
  )
}

export default Header
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
    selector: 'app-donate-modal',
    templateUrl: './donate-modal.component.html',
    styleUrls: ['./donate-modal.component.scss'],
})
export class DonateModalComponent implements OnInit {
    faCopy = faCopy;
    donationAddress: string = 'z1qquatn97szsv7m8ztna509cunu2tks4wtzveku';
    infoText: string = '';

    constructor(
        public dialogRef: MatDialogRef<DonateModalComponent>,
        private clipboard: Clipboard,
        @Inject(MAT_DIALOG_DATA) public donationAmount: number
    ) {}

    ngOnInit(): void {
        switch (this.donationAmount) {
            case 100:
                this.infoText = `Supply us with an Alien Commander by sending ${this.donationAmount} ZNN to the address below. Thank you for your
support!`;
                break;
            case 50:
                this.infoText = `Supply us with a Spaceship Engineer by sending ${this.donationAmount} ZNN to the address below. Thank you for your
support!`;
                break;
            case 10:
                this.infoText = `Supply us with a Repair Robot by sending ${this.donationAmount} ZNN to the address below. Thank you for your
support!`;
                break;
            default:
                this.infoText = `Supply us with Rocket Fuel by sending any amount of ZNN or QSR to the address below. Thank you for your
support!`;
                break;
        }
    }

    onClose(): void {
        this.dialogRef.close();
    }

    onCopyAddress(address: string) {
        this.clipboard.copy(address);
    }
}
